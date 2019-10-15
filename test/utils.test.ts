import { expect } from 'chai';
import { checkIsValidLink, getValidLinks, getWikiPageName } from '../src/utils';
import { URL_BLACKLIST } from '../src/constants';
import html from './html';

describe('checkIsValidLink', () => {
  it('should turn down external links', () => {
    expect(checkIsValidLink('https://www.google.com')).to.equal(false);
    expect(checkIsValidLink('www.google.com')).to.equal(false);
    expect(checkIsValidLink('google.com')).to.equal(false);
  });
  it('should turn down citation links', () => {
    expect(
      checkIsValidLink(
        'https://en.wikipedia.org/wiki/A_Few_Good_Men#cite_note-6'
      )
    ).to.equal(false);
    expect(checkIsValidLink('#cite_note-6')).to.equal(false);
  });
  it('should turn down wikipedia metapages', () => {
    expect(
      checkIsValidLink('https://en.wikipedia.org/wiki/Template_talk:Rob_Reiner')
    ).to.equal(false);
    expect(
      checkIsValidLink('https://en.wikipedia.org/wiki/Wikipedia:About')
    ).to.equal(false);
  });
  it('should turn down anything with a "blacklisted" url part', () => {
    URL_BLACKLIST.forEach(part => {
      expect(
        checkIsValidLink('https://en.wikipedia.org/wiki/' + part)
      ).to.equal(false);
    });
  });
});

describe('getValidLinks', () => {
  it('should filter out invalid links for this one specific random page', () => {
    const expected = [
      'https://en.wikipedia.org/wiki/Russia',
      'https://en.wikipedia.org/wiki/List_of_regions_of_Russia',
      'https://en.wikipedia.org/wiki/Bashkortostan',
      'https://en.wikipedia.org/wiki/Districts_of_Russia',
      'https://en.wikipedia.org/wiki/Iglinsky_District',
      'https://en.wikipedia.org/wiki/Time_zone',
      'https://en.wikipedia.org/wiki/UTC%2B5:00',
      'https://en.wikipedia.org/wiki/Russian_language',
      'https://en.wikipedia.org/wiki/Types_of_inhabited_localities_in_Russia',
      'https://en.wikipedia.org/wiki/Village#Russia'
    ];
    expect(getValidLinks(html)).to.eql(expected);
  });
});

describe('getWikiPageName', () => {
  it('should get readable wiki name', () => {
    const links = [
      'https://en.wikipedia.org/wiki/Russia',
      'https://en.wikipedia.org/wiki/List_of_regions_of_Russia',
      'https://en.wikipedia.org/wiki/Bashkortostan',
      'https://en.wikipedia.org/wiki/Districts_of_Russia',
      'https://en.wikipedia.org/wiki/Iglinsky_District'
    ];
    const expected = [
      'Russia',
      'List_of_regions_of_Russia',
      'Bashkortostan',
      'Districts_of_Russia',
      'Iglinsky_District'
    ];
    links.forEach((l, i) => {
      expect(getWikiPageName(l)).to.eql(expected[i]);
    });
  });
});
