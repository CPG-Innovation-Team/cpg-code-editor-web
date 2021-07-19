const dbHandler = () =>
  new Promise((resolve) => {
    const dbRequest = window.indexedDB.open('cpgCodeEditor');

    dbRequest.onsuccess = () => {
      resolve(dbRequest.result);
    };

    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('codeRecord')) {
        db.createObjectStore('codeRecord', { keyPath: 'roomId' });
      }
    };
  });

export const updateCodeInLocalDb = (code, roomId) => {
  dbHandler().then((db) => {
    db.transaction(['codeRecord'], 'readwrite').objectStore('codeRecord').put({ roomId, code, updateTime: Date.now() });
  });
};

export const getCodeInLocalDb = (roomId) =>
  new Promise((resolve) => {
    dbHandler().then((db) => {
      const transaction = db.transaction(['codeRecord']);
      const objectStore = transaction.objectStore('codeRecord');
      const request = objectStore.get(roomId);

      request.onsuccess = () => {
        if (request.result) {
          console.log(request.result.code);
          resolve(request.result.code);
        }
      };
    });
  });
