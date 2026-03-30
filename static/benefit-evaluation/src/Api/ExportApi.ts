import { invoke } from "@forge/bridge";

export const exportApi = () => ({
  exportData: (scopeId: string): Promise<any> =>
    invoke("exportData", { scopeId }),
});
