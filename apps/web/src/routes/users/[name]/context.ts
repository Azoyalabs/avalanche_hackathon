import { setContext, getContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

export enum LayoutLink {
    Published = '',
    Backed = 'backed',
    Profile = 'profile',
    Stats = 'stats'
}
export const CONTEXT_KEY = "LAYOUT";



export function getLayoutContext(){
    return getContext(CONTEXT_KEY);
}

export function setLayoutContext(link: LayoutLink){
    const layout = getContext<Writable<LayoutLink>>(CONTEXT_KEY);
    layout.set(link);
}