import PocketBase from 'pocketbase'
import { expand, providers } from './utils/user';
import { writable } from "svelte/store";

export const pb = new PocketBase("http://127.0.0.1:8090");

export const profile = writable(expand(pb.authStore.model));

pb.authStore.onChange((auth) => {
    profile.set(expand(pb.authStore.model));
});

export function logout() {
    pb.authStore.clear();
}

export async function getUser(id) {
    const user = await pb.collection('users').getOne(id);
    return expand(user);
}

async function getUsername() {
    const res = await pb.collection('username').getOne(0);
    return res.which + res.who;
}

async function updateUsername(user) {
    for (let i = 0; i < 8; i++) {
        try {
            await pb.collection('users').update(user.id, {
                username: await getUsername()
            });
            break;
        } catch (err) {
            console.log(err);
        }
    }
}

export async function authWithProvider(id) {
    const res = await pb.collection('users').authWithOAuth2({ provider: providers[id] });

    if (res.meta.isNew) {
        await pb.collection('users').update(res.record.id, {
            fullname: res.meta.name,
            provider: id
        });
        updateUsername(res.record);
    }
    return res;
}