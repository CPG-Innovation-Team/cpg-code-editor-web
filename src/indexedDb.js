const dbHandler = (callback) => {
  const dbRequest = window.indexedDB.open('cpgCodeEditor');

  dbRequest.onsuccess = () => {
    callback(dbRequest.result);
  };

  dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('codeRecord')) {
      db.createObjectStore('codeRecord', { keyPath: 'id' });
    }
  };
};

export const updateCode = (code) => {
  dbHandler((db) => {
    db.transaction(['codeRecord'], 'readwrite')
      .objectStore('codeRecord')
      .put({ id: 1, code, updateTime: Date.now() });
  });
};

export const getCode = () => new Promise((resolve) => {
  dbHandler((db) => {
    const transaction = db.transaction(['codeRecord']);
    const objectStore = transaction.objectStore('codeRecord');
    const request = objectStore.get(1);

    request.onsuccess = () => {
      if (request.result) {
        console.log(request.result.code);
        resolve(request.result.code);
      }
    };
  });
});
