import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Hit from "../components/hit";
import { ScopesContext } from "../contexts/scopes";
import getScopes from "../utils/scopes";

type SearchProps = {
  scopes: string[]
}

export default function Search({ scopes }: SearchProps) {
  const router = useRouter();
  const [hits, setHits] = useState([]);
  const { setScopes } = useContext(ScopesContext);

  useEffect(() => {
    setScopes(scopes)
  }, [scopes, setScopes])

  useEffect(() => {
    // NOTE: This is a workaround for *not* executing query before hydration; without this
    // `execQuery` is run with empty `router.query`.
    if (!Object.keys(router.query).length) {
      return
    }

    const execQuery = async () => {
      const params = new URLSearchParams(router.query as Record<string, string>)
      await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/search?${params}`)
        .then(response => response.json())
        .then(hits => setHits(hits))
        .catch((err) => console.error(err))
    }
    execQuery()
  }, [router.query])



  return (
    <div className="flex flex-col items-baseline space-y-3 w-4/5 lg:w-1/2">
      <ul className="flex flex-col space-y-3">
        {
          hits.map((hit, idx) => {
            return (
              <li key={idx} className="border border-black p-3">
                <Hit hit={hit} />
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      scopes: await getScopes()
    }
  }
}
