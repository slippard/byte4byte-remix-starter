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

export const getPlausibleStats = async ({ site }: { site: string }) => {
    const response = await fetch(`https://plausible.io/api/v1/stats/aggregate?site_id=${site}&period=month&metrics=visitors,pageviews,bounce_rate,visit_duration`, {
        headers: {
            Authorization: `Bearer ${env.PLAUSIBLE_API_TOKEN}`
        }
    });
    const res: ApiResponse = await response.json()
    return res;
}