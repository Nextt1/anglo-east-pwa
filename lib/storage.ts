// import { set } from "idb-keyval";

export type ReceiptMeta = {
  id: string;
  imgBlob: Blob;
  shopName: string;
  createdAt: string;
};

// export const saveReceipt = (meta: ReceiptMeta) => set(meta.id, meta);
