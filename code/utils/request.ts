export default function (url: string, callback: (data: any) => void) {
  fetch(url)
    .then((res) => res.json())
    .then(callback)
    .catch(console.error);
}
