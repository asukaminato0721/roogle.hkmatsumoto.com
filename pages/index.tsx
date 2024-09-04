import { useContext, useEffect } from "react";
import Link from "next/link";

import { ScopesContext } from "../contexts/scopes";
import getScopes from "../utils/scopes";

type Example = {
  query: string,
  scope: string,
}

const SET_CRATES = "set:crates"
const SET_LIBSTD = "set:libstd"
const SET_RUSTC = "set:rustc"

const EXAMPLES: Example[] = [
  { query: "fn (&char) -> bool", scope: SET_LIBSTD },
  { query: "fn (&mut HashMap<K, V>, K, V) -> Option<V>", scope: SET_LIBSTD },
  { query: "fn get_ref(&Option<T>) -> Option<&T>", scope: SET_LIBSTD },
  { query: "fn (Option<Option<T>>) -> Option<T>", scope: SET_LIBSTD },
  { query: "fn (&mut Vec<T>, value: T)", scope: SET_LIBSTD },
  { query: "fn generics(TyCtxt, key: _) -> &Generics", scope: SET_RUSTC },
  { query: "fn (TyCtxt, key: _) -> Span", scope: SET_RUSTC },
  { query: "fn (Either<L, R>) -> Either<R, L>", scope: SET_CRATES }
]

type HomeProps = {
  scopes: string[]
}

export default function Home({ scopes }: HomeProps) {
  const { setScopes } = useContext(ScopesContext);

  useEffect(() => {
    setScopes(scopes)
  }, [scopes, setScopes])

  return (
    <div className="flex flex-col items-center w-4/5 lg:w-1/2">
      <p className="text-2xl">Examples</p>
      <ul>
        {EXAMPLES.map((example, idx) => (
          <li key={idx}>
            <Link href={{
              pathname: "/search",
              query: example
            }}>
              <a className="font-mono link">
                {example.query}
              </a>
            </Link>
          </li>
        ))}
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
