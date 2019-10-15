import * as cheerio from 'cheerio';
import axios from 'axios';
import * as URI from 'urijs';
import { Page } from './PageGraph';
import { URL_BLACKLIST } from './constants';

/** Turns down intra-page links, external pages, and special wikipedia pages */
function checkIsValidLink(url: string) {
  if (
    url.startsWith('#') ||
    URL_BLACKLIST.some(urlPart => url.includes(urlPart))
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
  ['#mw-content-text a', '.infobox a'].forEach(selector => {
    const elements = $(selector);
    elements.each((_, el) => {
      const { href } = el.attribs;
      if (href) {
        const isValid = checkIsValidLink(href);
        if (isValid) {
          // normalize url
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

const getWikiPageName = (url: string) =>
  url.replace('https://en.wikipedia.org/wiki/', '');

/** fetches a page and returns a Page instance */
export async function getPageFromUrl(
  url: string,
  parent?: Page,
  retries = 0
): Promise<Page | undefined> {
  try {
    const response = await axios(url, { timeout: 30000 });
    const links = getValidLinks(response.data);
    const pathString = `${
      parent ? parent.pathString + ' -> ' : ''
    }${getWikiPageName(url)}`;
    return {
      id: url,
      outgoingLinks: links,
      pathString
    };
  } catch (err) {
    if (retries) {
      return getPageFromUrl(url, parent, retries - 1);
    } else {
      // at this point, all retries have failed, so treat it like a dead link
      console.log('ERROR GETTING PAGE ' + url);
      return undefined;
    }
  }
}
