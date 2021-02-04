const {
  filterBy,
  filterByPlaceholder,
  formatPlaceholdeURL,
  formatWildcardURL,
  getRedirectURL
} = require('../lib/helpers/redirect-url-parser.js')

const data = {
  "/legacy-url/": "/updated-url/",
  "/legacy-placeholder/:placeholder/lorem/": "/updated-placeholder/lorem/:placeholder/",
  "/legacy-placewilder/:placeholder/*": "/updated-placewilder/:placeholder/lorem/*",
  "/puppy-sponsor/:pupnames/gallery/": "/sponsor-a-puppy/gallery/:pupname/",
  "/wildcard-url/*": "/updated-wildcard-url/",
  "/incorrect-wildcard-url/*": "/updated-incorrect-wildcard-url/",
  "/nested-wildcard-url/*": "/updated-nested-wildcard-url/*",
}

describe('integration tests', () => {
  test('default redirect', () => {
    const url = getRedirectURL("/legacy-url/", data)
    expect(url).toBe("/updated-url/");
  });
  test('wildcard redirect in both directions', () => {
    const url = getRedirectURL("/wildcard-url/some/path/", data)
    expect(url).toBe("/updated-wildcard-url/");
  });
  test('wildcard redirect in single direction', () => {
    const url = getRedirectURL("/nested-wildcard-url/some/path/", data)
    expect(url).toBe("/updated-nested-wildcard-url/some/path/");
  });
  test('placeholder redirect', () => {
    const url = getRedirectURL("/legacy-placeholder/the-placeholder/lorem/", data)
    expect(url).toBe("/updated-placeholder/lorem/the-placeholder/");
  });

  test('placeholder and wildcard redirect', () => {
    const url = getRedirectURL("/legacy-placewilder/the-placeholder/some/path", data)
    expect(url).toBe("/updated-placewilder/the-placeholder/lorem/some/path");
    
  });
  
  test('no redirect found', () => {
    const url = getRedirectURL("/unknown-url/", data)
    expect(url).toBe(null);
  });
})


describe('wildcard tests', () => {
  test('formats path without wildcard in toURL', () => {
    const url = formatWildcardURL(
      "/nested-wildcard-url/some/path/",
      "/nested-wildcard-url/*",
      "/updated-nested-wildcard-url/")

    expect(url).toBe("/updated-nested-wildcard-url/");
  });
  
  test('formats path with wildcard in toURL', () => {
    const url = formatWildcardURL(
      "/nested-wildcard-url/some/path/",
      "/nested-wildcard-url/*",
      "/updated-nested-wildcard-url/*")

    expect(url).toBe("/updated-nested-wildcard-url/some/path/");
  });

  test('formats path with wildcard and querystring in toURL', () => {
    const url = formatWildcardURL(
      "/nested-wildcard-url/some/path/",
      "/nested-wildcard-url/*",
      "/updated-nested-wildcard-url/*?x=2")

    expect(url).toBe("/updated-nested-wildcard-url/some/path/?x=2");
  });


  test('finds redirect url correctly', () => {
    const match = filterBy("/wildcard-url/some/path/", data)
    expect(match).toEqual(expect.arrayContaining(["/wildcard-url/*"]));
  });
})

describe('placeholder tests', () => {
  test('formats path with placeholder', () => {
    const url = formatPlaceholdeURL(
      "/puppy-sponsor/ruby/gallery/",
      "/puppy-sponsor/:pupnames/gallery/",
      "/sponsor-a-puppy/gallery/:pupname/")

    expect(url).toBe("/sponsor-a-puppy/gallery/ruby/");
  });


  test('finds redirect url correctly', () => {
    const match = filterByPlaceholder("/puppy-sponsor/ruby/gallery/", data)
    expect(match).toEqual(expect.arrayContaining(["/puppy-sponsor/:pupnames/gallery/"]));
  });
  
  test('doesnt find path with placeholder', () => {
    const match = filterByPlaceholder("/puppy-sponsor-fail/ruby/gallery/", data)
    expect(match).toHaveLength(0);
  });
})