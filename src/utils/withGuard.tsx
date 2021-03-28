import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Cookie from 'js-cookie'
import Layout from 'components/Layout'

export default function withGuard(WrappedComponent:any) {
  const Wrapper = (props: unknown) => {
    const router = useRouter()

    useEffect(() => {
      const accessToken = Cookie.get('accessToken')

      if(!accessToken) {
        router.replace('/')
      }
    })

    return <Layout><WrappedComponent {...props} /></Layout>
  }

  /* Wrapper.getInitialProps = async (context: any) => {

    const props = WrappedComponent.getInitialProps && await WrappedComponent.getInitialProps(context);

    const accessToken = context.req?.headers?.cookie?.replace('accessToken=', '')

    if(!accessToken) {
      context.res?.writeHead(301, {Location: '/'}).end()
    }

    return {...props}
  } */

  return Wrapper
}