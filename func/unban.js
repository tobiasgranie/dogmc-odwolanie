import { decodeJwt } from "./helpers/jwt-helpers.js";
import { unbanUser } from "./helpers/user-helpers.js";

export async function handler(event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    if (event.queryStringParameters.token !== undefined) {
        const unbanInfo = decodeJwt(event.queryStringParameters.token);
        if (unbanInfo.userId !== undefined) {
            try {
                await unbanUser(unbanInfo.userId, process.env.GUILD_ID, process.env.DISCORD_BOT_TOKEN);
                
                return {
                    statusCode: 303,
                    headers: {
                        "Location": `/success?msg=${encodeURIComponent("Użytkownik został odbanowany\nSkontaktuj się z nim, i powiedz mu o tym.")}`
                    }
                };
            } catch (e) {
                return {
                    statusCode: 303,
                    headers: {
                        "Location": `/error?msg=${encodeURIComponent("Wystąpił problem!\nOdbanuj go manualnie")}`
                    }
                };
            }
        }
    }

    return {
        statusCode: 400
    };
}
