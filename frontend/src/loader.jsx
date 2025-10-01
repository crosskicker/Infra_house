import { fetchGet } from "./fetch";

export async function infrastructureLoader() {
  return fetchGet("/api/vms-info");
}