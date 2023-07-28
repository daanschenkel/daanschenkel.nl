export async function load(){
    let response = await fetch("https://api.lanyard.rest/v1/users/654390669472694284").then(res => res.json());
    return response;
}