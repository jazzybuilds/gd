const {
  filterBy,
  filterByPlaceholder,
  formatPlaceholdeURL,
  formatWildcardURL,
  getRedirectURL
} = require('../lib/helpers/redirect-url-parser.js')

const data = [
  {
    from: "/legacy-url/",
    to: "/updated-url/"
  },
  {
    from: "/legacy-placeholder/:placeholder/lorem/",
    to: "/updated-placeholder/lorem/:placeholder/"
  },
  {
    from: "/legacy-placewilder/:placeholder/*",
    to: "/updated-placewilder/:placeholder/lorem/*"
  },
  {
    from: "/legacy-double-placewilder/:placer/:placeholder/*",
    to: "/updated-double-placewilder/:placeholder/lorem/:placer/*"
  },
  {
    from: "/puppy-sponsor/:pupnames/gallery/",
    to: "/sponsor-a-puppy/gallery/:pupname/"
  },
  {
    from: "/wildcard-url/*",
    to: "/updated-wildcard-url/"
  },
  {
    from: "/incorrect-wildcard-url/*",
    to: "/updated-incorrect-wildcard-url/"
  },
  {
    from: "/nested-wildcard-url/*",
    to: "/updated-nested-wildcard-url/*"
  },
]

describe('integration tests', () => {
  test('default redirect', () => {
    const url = getRedirectURL("/legacy-url/", data)
    expect(url).toBe("/updated-url/");
  });


  test('formats path with two placeholder and wildcard', () => {
    const url = getRedirectURL("/legacy-double-placewilder/temp/value/some/path/", data)
    expect(url).toBe("/updated-double-placewilder/value/lorem/temp/some/path/");
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
    expect(match).toEqual(expect.arrayContaining([{"from": "/wildcard-url/*", "to": "/updated-wildcard-url/"}]));
  });
})

describe('placeholder tests', () => {
  test('formats path with placeholder', () => {
    const url = formatPlaceholdeURL(
      "/puppy-sponsor/ruby/gallery/",
      "/puppy-sponsor/:pupname/gallery/",
      "/sponsor-a-puppy/gallery/:pupname/")

    expect(url).toBe("/sponsor-a-puppy/gallery/ruby/");
  });

  test('formats path with two placeholder', () => {
    const url = formatPlaceholdeURL(
      "/puppy-sponsor/ruby/gallery/",
      "/puppy-sponsor/:pupname/:sub/",
      "/sponsor-a-puppy/:sub/:pupname/")

    expect(url).toBe("/sponsor-a-puppy/gallery/ruby/");
  });

  test('finds redirect url correctly', () => {
    const match = filterByPlaceholder("/puppy-sponsor/ruby/gallery/", data)
    expect(match).toEqual(expect.arrayContaining([{"from": "/puppy-sponsor/:pupnames/gallery/", "to": "/sponsor-a-puppy/gallery/:pupname/"}]));
  });
  
  test('doesnt find path with placeholder', () => {
    const match = filterByPlaceholder("/puppy-sponsor-fail/ruby/gallery/", data)
    expect(match).toHaveLength(0);
  });
})