import { env } from "process";

interface ApiResponse {
    results: {
        bounce_rate: {
            value: number
        },
        pageviews: {
            value: number
        },
        visit_duration: {
            value: number
        },
        visitors: {
            value: number
        }
    }
}

interface ApiBreakdownResponse {
    results: [
        {
            page: string,
            visitors: number
        }
    ]
}

interface ApiSourceResponse {
    results: [
        {
            bounce_rate: string,
            source: string,
            visitors: number
        }
    ]
}

interface ApiTimeSeries {
    results: [
        {
            date: string,
            visitors: number
        }
    ]
}

export const plausibleSite = "byte4byte-remix-starter.fly.dev"

export const getPlausibleHealth = async () => {
    const response = await fetch('https://plausible.io/api/health')
    const res: { clickhouse: string, postgres: string, sites_cache: string } = await response.json()
    return res;
}

export const getMonthData = async () => {
    const response = await fetch(`https://plausible.io/api/v1/stats/timeseries?site_id=${plausibleSite}&period=30d`, {
        headers: {
            Authorization: `Bearer ${env.PLAUSIBLE_API_TOKEN}`
        }
    });
    const res: ApiTimeSeries = await response.json()
    return res;
}

export const getPlausibleTopSources = async () => {
    const response = await fetch(`https://plausible.io/api/v1/stats/breakdown?site_id=${plausibleSite}&period=30d&property=visit:source&metrics=visitors,bounce_rate&limit=4`, {
        headers: {
            Authorization: `Bearer ${env.PLAUSIBLE_API_TOKEN}`
        }
    });
    const res: ApiSourceResponse = await response.json()
    return res;
}

export const getPlausibleTopPages = async () => {
    const response = await fetch(`https://plausible.io/api/v1/stats/breakdown?site_id=${plausibleSite}&period=6mo&property=event:page&limit=8`, {
        headers: {
            Authorization: `Bearer ${env.PLAUSIBLE_API_TOKEN}`
        }
    });
    const res: ApiBreakdownResponse = await response.json()
    return res;
}

export const getPlausibleStats = async () => {
    const response = await fetch(`https://plausible.io/api/v1/stats/aggregate?site_id=${plausibleSite}&period=month&metrics=visitors,pageviews,bounce_rate,visit_duration`, {
        headers: {
            Authorization: `Bearer ${env.PLAUSIBLE_API_TOKEN}`
        }
    });
    const res: ApiResponse = await response.json()
    return res;
}