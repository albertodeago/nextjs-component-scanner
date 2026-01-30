import { Card, CardBody, CardFooter } from "@/components/ui";
import { UserActions } from "./UserActions";

// Server component
function UserRow({ user }: { user: { id: number; name: string; email: string } }) {
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        {/* Client component inside server component */}
        <UserActions userId={user.id} />
      </td>
    </tr>
  );
}

// Mock data
const users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
];

export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      <Card>
        <CardBody>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </CardBody>
        <CardFooter>
          <p>Total: {users.length} users</p>
        </CardFooter>
      </Card>
    </div>
  );
}
