/**
 * Makes a request to an external server endpoint.
 * @param url The external URL to request from.
 * @param callback The logic to handle the result.
 * @param acc The accumulator to collect results.
 */
export default async function request(
  url: string,
  callback: (data: any) => void,
  acc = []
) {
  const data = await new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        const collection = acc.concat(response.results);
        if (response.next) {
          request(response.next, callback, collection);
        } else {
          resolve(collection);
        }
      })
      .catch(reject);
  });

  callback(data);
}
