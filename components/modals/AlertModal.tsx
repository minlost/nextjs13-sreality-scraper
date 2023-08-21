"use client"

import { Loader } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { Button } from "../ui/Button"
import Modal from "./Modal"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <Modal
        title="Opravdu chcete provést tento krok?"
        isOpen={isOpen}
        description="Akce se nedá vrátit zpět."
        onClose={onClose}
      >
        <div className="pt-6 space-x-2 flex item-center justify-end w-full">
          <Button disabled={loading} variant="outline" onClick={onClose}>
            Zrušit
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onConfirm}>
            Smazat
            {loading && <Loader className=" ml-2 h-4 w-4 animate-spin" />}{" "}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default AlertModal
