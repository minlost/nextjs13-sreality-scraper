"use client"

import ProfileFrom from "@/components/profileForm/ProfileForm"
import { Button } from "@/components/ui/Button"
import { useState } from "react"

interface NewProfileProps {
  userId: string
}

const NewProfile = ({ userId }: NewProfileProps) => {
  const [isOpened, setIsOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={() => setIsOpened((prev) => !prev)}
        className="text-white bg-blue-400"
      >
        Založit nový profil
      </Button>
      {isOpened && (
        <ProfileFrom
          userId={userId}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setIsOpened={setIsOpened}
        />
      )}
    </div>
  )
}

export default NewProfile
