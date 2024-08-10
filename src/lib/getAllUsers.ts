import { redis } from "@/db/db";
import { User } from "@/db/dummy";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
async function getAllUsers(): Promise<User[]> {
	const userKeys: string[] = [];
	let cursor = "0";

	do {
		const [nextCursor, keys] = await redis.scan(cursor, { match: "user:*", type: "hash", count: 100 });
		cursor = nextCursor;
		userKeys.push(...keys);
	} while (cursor !== "0");
	// user:123 user:456 user:789

	const { getUser } = getKindeServerSession();
	const currentUser = await getUser();

	const pipeline = redis.pipeline();
	userKeys.forEach((key) => pipeline.hgetall(key));
	const results = (await pipeline.exec()) as User[];

	const users: User[] = [];
	for (const user of results) {
		// exclude the current user from the list of users in the sidebar
		if (user.id !== currentUser?.id) {
			users.push(user);
		}
	}
	return users;
}

export default getAllUsers;