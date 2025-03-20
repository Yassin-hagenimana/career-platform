'use client'

import dynamic from 'next/dynamic'

export const WorkshopRegistrationDialog = dynamic(
  () => import("@/app/workshops/register-workshop-dialog").then(
    (mod) => ({ default: mod.WorkshopRegistrationDialog })
  ),
  { ssr: false }
)