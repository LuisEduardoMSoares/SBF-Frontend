import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Cookie from 'js-cookie'
import Layout from 'components/Layout'

export default function withGuard(WrappedComponent:any) {
  const Wrapper = (props: unknown) => {
    const router = useRouter()

    useEffect(() => {
      const accessToken = Cookie.get('accessToken')
      const isAdmin: boolean = Cookie.get('isAdmin') === "true"

      if(!accessToken || !isAdmin) {
        router.replace('/')
      }
    })

    return <Layout><WrappedComponent {...props} /></Layout>
  }

  return Wrapper
}