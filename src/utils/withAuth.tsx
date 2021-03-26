import { ElementType, useEffect, useState } from "react"
import Cookie from 'js-cookie'
import { useRouter } from "next/router"
import Layout from 'components/Layout'

export default function withAuth(WrappedComponent: ElementType) {
  const Wrapper = (props: unknown) => {
    const [token, setToken] = useState(false as unknown)
    const router = useRouter()

    useEffect(() => {
      const accessToken = token || Cookie.get('token')

      if(!accessToken) {
        setToken(false)
        router.replace('/')
      }

      setToken(accessToken)
    })

    return <Layout><WrappedComponent {...props} /></Layout>
  }

  return Wrapper
}