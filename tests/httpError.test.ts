import { searchCountries } from '../src/core/searchCountries';

it('should throw HttpError for unsuccessful HTTP responses', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

  await expect(searchCountries('Spain', new AbortController().signal)).rejects.toMatchObject({
    name: 'HttpError',
    status: 500,
  });
});
