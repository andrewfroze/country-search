import { searchCountries } from '../src/core/searchCountries';

it('should return an empty array when country is not found', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 404 }));

  await expect(searchCountries('Spain', new AbortController().signal)).resolves.toMatchObject([]);
});
