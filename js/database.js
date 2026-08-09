const AXIOM_DATABASE = "AxiomDatabase";
const AXIOM_DATABASE_VERSION = 1;

const STORES = {
    subjects: "subjects",
    topics: "topics",
    materials: "materials",
    studySessions: "studySessions",
    settings: "settings"
};

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(
            AXIOM_DATABASE,
            AXIOM_DATABASE_VERSION
        );

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            if (!database.objectStoreNames.contains(STORES.subjects)) {
                const subjects = database.createObjectStore(
                    STORES.subjects,
                    { keyPath: "id" }
                );

                subjects.createIndex("name", "name", {
                    unique: false
                });
            }

            if (!database.objectStoreNames.contains(STORES.topics)) {
                const topics = database.createObjectStore(
                    STORES.topics,
                    { keyPath: "id" }
                );

                topics.createIndex("subjectId", "subjectId", {
                    unique: false
                });

                topics.createIndex("name", "name", {
                    unique: false
                });
            }

            if (!database.objectStoreNames.contains(STORES.materials)) {
                const materials = database.createObjectStore(
                    STORES.materials,
                    { keyPath: "id" }
                );

                materials.createIndex("subjectId", "subjectId", {
                    unique: false
                });

                materials.createIndex("topicId", "topicId", {
                    unique: false
                });

                materials.createIndex("type", "type", {
                    unique: false
                });

                materials.createIndex("difficulty", "difficulty", {
                    unique: false
                });
            }

            if (!database.objectStoreNames.contains(STORES.studySessions)) {
                const sessions = database.createObjectStore(
                    STORES.studySessions,
                    { keyPath: "id" }
                );

                sessions.createIndex("materialId", "materialId", {
                    unique: false
                });

                sessions.createIndex("date", "date", {
                    unique: false
                });
            }

            if (!database.objectStoreNames.contains(STORES.settings)) {
                database.createObjectStore(
                    STORES.settings,
                    { keyPath: "key" }
                );
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

function generateId() {
    return (
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).substring(2, 10)
    );
}

async function addItem(storeName, item) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            storeName,
            "readwrite"
        );

        const store = transaction.objectStore(storeName);

        if (!item.id) {
            item.id = generateId();
        }

        const request = store.add(item);

        request.onsuccess = () => {
            resolve(item);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function updateItem(storeName, item) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            storeName,
            "readwrite"
        );

        const store = transaction.objectStore(storeName);

        const request = store.put(item);

        request.onsuccess = () => {
            resolve(item);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function getItem(storeName, id) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            storeName,
            "readonly"
        );

        const store = transaction.objectStore(storeName);

        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function getAllItems(storeName) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            storeName,
            "readonly"
        );

        const store = transaction.objectStore(storeName);

        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function deleteItem(storeName, id) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            storeName,
            "readwrite"
        );

        const store = transaction.objectStore(storeName);

        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function clearStore(storeName) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            storeName,
            "readwrite"
        );

        const store = transaction.objectStore(storeName);

        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}
