import { redirect } from "next/navigation"

export default function UserDetailAliasPage({
  params,
}: {
  params: { id: string }
}) {
  redirect(`/members/${params.id}`)
}
