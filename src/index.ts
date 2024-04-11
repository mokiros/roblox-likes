import { AutoRouter } from 'itty-router'

export interface Env {}

const router = AutoRouter()

router.get('/', () => 'Hello!')

router.get('/v1/games/votes', async ({ query }) => {
	const regex = /^[0-9,]{1,512}$/
	const params = query.universeIds
	if (typeof params !== 'string' || params.length > 512 || !regex.test(params))
		return { result: 'error', error: 'Invalid "universeIds" query param' }
	const url = `https://games.roblox.com/v1/games/votes?universeIds=${params}`
	const request = await fetch(url)
	if (!request.ok) {
		return { result: 'error', error: `API returned response code ${request.status} (${request.statusText})` }
	}
	try {
		const response = await request.json()
		return { result: 'success', response: { response } }
	} catch (e) {
		return { result: 'error', error: 'API returned invalid JSON' }
	}
})

export default { ...router }
