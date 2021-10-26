import { useContext, useEffect } from "react";
import { useRouter } from "next/router"
import Link from "next/link"
import { useForm } from "react-hook-form"

import { ScopesContext } from "../contexts/scopes";

type FormData = {
  query: string,
  scope: string,
}

export default function Header() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      query: "",
      scope: "set:libstd"
    }
  });
  const { scopes } = useContext(ScopesContext);

  useEffect(() => {
    if (router.query.query) {
      setValue("query", router.query.query as string)
    }
    if (router.query.scope) {
      setValue("scope", router.query.scope as string)
    }
  }, [router.query])

  const onSubmit = (data: FormData) => {
    router.push({
      pathname: "/search",
      query: {
        query: data.query,
        scope: data.scope,
      }
    })
  }

  return (
    <div className="flex flex-col items-center w-4/5 lg:w-2/3 my-5 space-y-5">
      <Link href="/">
        <a className="font-logo text-5xl">Roogle</a>
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full space-x-3">
        <select {...register("scope")} className="font-mono text-sm max-w-xs overflow-ellipsis border border-black">
          {
            scopes.map((scope, idx) => (
              <option value={scope} key={idx}>{scope}</option>
            ))
          }
        </select>
        <input type="text" {...register("query")} placeholder="Search for ..."
          className="w-full font-mono text-2xl p-2 border focus:outline-none focus border-black focus:border-blue-600" />
      </form>
    </div>
  )
}