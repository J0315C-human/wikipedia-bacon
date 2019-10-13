import * as cheerio from 'cheerio';
import axios from 'axios';
import * as URI from 'urijs';
import { urlBlacklist } from './constants';
import { Page } from './PageGraph';

const _wikiLinkSelectors = ['#mw-content-text a', '.infobox a'];

function checkIsValidLink(url: string) {
  // turn down links to same page and special wikipedia pages
  if (
    url.startsWith('#') ||
    urlBlacklist.some(urlPart => url.includes(urlPart))
  ) {
    return false;
  }
  const uri = URI(url);
  const domain = uri.domain();
  if (domain === 'wikipedia.org' || (!domain && url.startsWith('/'))) {
    return true;
  } else return false;
}

function getValidLinks(html: string) {
  const links = [] as string[];
  const $ = cheerio.load(html);
  _wikiLinkSelectors.forEach(selector => {
    const elements = $(selector);
    elements.each((_, el) => {
      const { href } = el.attribs;
      if (href) {
        const isValid = checkIsValidLink(href);
        if (isValid) {
          if (href.startsWith('/')) {
            links.push('https://en.wikipedia.org' + href);
          } else {
            links.push(href);
          }
        }
      }
    });
  });
  // filter out duplicates
  return links.filter((link, idx) => links.indexOf(link) === idx);
}

export async function getPageFromUrl(
  url: string,
  retries = 0
): Promise<Page | undefined> {
  try {
    const response = await axios(url, { timeout: 30000 });
    const links = getValidLinks(response.data);
    return {
      id: url,
      outgoingLinks: links
    };
  } catch (err) {
    if (retries) {
      console.log('RETRYING ' + retries + ': ' + url);
      return getPageFromUrl(url, retries - 1);
    } else {
      console.log('ERROR GETTING PAGE ' + url);
      return undefined;
    }
  }
}
