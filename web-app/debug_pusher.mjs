import Pusher from 'pusher';
console.log("Pusher type:", typeof Pusher);
console.log("Pusher keys:", Object.keys(Pusher || {}));
try {
  const p = new Pusher({ appId: '1', key: '1', secret: '1', cluster: '1' });
  console.log("Success with new Pusher()");
} catch (e) {
  console.log("Fail with new Pusher():", e.message);
}
