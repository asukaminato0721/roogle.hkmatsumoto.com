import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router"
import Link from "next/link"
import { useForm } from "react-hook-form"
import hljs from "highlight.js/lib/core"
import { ScopesContext } from "../contexts/scopes";
import 'highlight.js/styles/default.css';
type FormData = {
  query: string,
  scope: string,
}
hljs.registerLanguage('rust', require('highlight.js/lib/languages/rust'));
export default function Header() {
  const router = useRouter();
  const [query_text, set_query_text] = useState("");
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
      set_query_text(router.query.query as string)  
    }
    if (router.query.scope) {
      setValue("scope", router.query.scope as string)
    }
  }, [router.query, setValue])

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
    <div className="flex flex-col items-center w-4/5 lg:w-1/2 m-5 space-y-5">
      <Link href="/">
        <a className="font-logo text-5xl">Roogle</a>
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center w-full">
        <select {...register("scope")} className="font-mono p-1 focus border border-black focus:border-blue-600">
          {
            scopes.map((scope, idx) => (
              <option value={scope} key={idx}>{scope}</option>
            ))
          }
        </select>
        <div className="relative w-full text-2xl p-2 my-3">
          <input type="text" {...register("query")} placeholder="Search for ..."
            onChange={e=>set_query_text(e.target.value)}
            className="absolute -z-1  bg-transparent top-0 left-0 w-full font-mono font-bold text-2xl p-2 my-3 border focus:outline-none focus border-black focus:border-blue-600" />
          <div dangerouslySetInnerHTML={{__html: hljs.highlight(query_text, {language: 'rust'}).value}}
          className="absolute z-1 my-3 font-mono font-bold border border-transparent"
          ></div>
        </div>
      </form>
     
        </div>
  )
}