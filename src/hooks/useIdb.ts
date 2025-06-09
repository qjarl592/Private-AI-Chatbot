// import { useQuery } from "@tanstack/react-query";
// import { openDB } from "idb";
// import { useState } from "react";

// const DB_NAME = "private-ai-chat-db";
// const DB_VERSION = 1;
// const STORE_NAME = "chat";

// export function useIdb() {
//   const { data: idbInstance } = useQuery({
//     queryKey: ["openIdb"],
//     queryFn: () =>
//       openDB(DB_NAME, DB_VERSION, {
//         upgrade(db) {
//           if (!db.objectStoreNames.contains(STORE_NAME)) {
//             db.createObjectStore(STORE_NAME, {
//               keyPath: "id",
//               autoIncrement: true,
//             });
//           }
//         },
//       }),
//   });

//   const getAllItems = async () => {
//     if (!idbInstance) return [];
//     return await idbInstance.getAll(STORE_NAME);
//   };
// }
