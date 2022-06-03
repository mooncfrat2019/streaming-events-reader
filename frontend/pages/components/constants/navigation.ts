interface Navigation {
    [key: string]: Panels
}

interface Panels {
    [key: string]: string
}

export const NAVI: Navigation = {
    START: {
        EVENTS: 'EVENTS',
        DASHBOARD: 'DASHBOARD',
    }
}
