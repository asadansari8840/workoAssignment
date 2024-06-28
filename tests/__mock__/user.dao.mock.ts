export class UserDAOMock {
    private users: { [key: string]: any } = {
        '1': { id: '1', name: 'User 1' },
        '2': { id: '2', name: 'User 2' },
    };

    public async getAllUsers(page: number, limit: number, onlyActive: boolean) {
        // Simulate fetching users based on pagination parameters
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const users = Object.values(this.users).slice(startIndex, endIndex);

        return {
            totalUsers: Object.keys(this.users).length,
            users,
            currentPage: page,
        };
    }

    public async getUserByUserId(userId: string) {
        // Simulate fetching a user by userId
        const user = this.users[userId];
        return {user};
    }

    public async createUser(userData: any) {
        // Simulate creating a new user
        const newUser = {
            id: (Object.keys(this.users).length + 1).toString(), // Generate a new id
            ...userData,
        };
        this.users[newUser.id] = newUser;
        return {user: newUser}; // Return the created user
    }
    public async updateUser(userId: string, updateData: any) {
        // Simulate updating user details
        if (!this.users[userId]) {
            throw new Error('User not found');
        }
        this.users[userId] = {...this.users[userId], ...updateData};
        return {isUpdated: true};
    }

    public async loginUser(email: string, password: string) {
        // Simulate logging in a user
        const user = Object.values(this.users).find((u) => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        return {user};
    }

    public async deleteUser(userId: string) {
        // Simulate deleting a user
        if (!this.users[userId]) {
            throw new Error('User not found');
        }
        delete this.users[userId];
        return {isDeleted: true};
    }
}
