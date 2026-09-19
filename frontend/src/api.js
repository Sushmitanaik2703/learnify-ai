export async function fetchHealth(){
  return fetch('http://localhost:8000/api/health');
}
