// /components/userButton.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserButton = ({ imgUrl }: { imgUrl: string }) => {
  return (
    <Avatar>
      <AvatarImage
        src={imgUrl}
        alt="User image"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}

export default UserButton
