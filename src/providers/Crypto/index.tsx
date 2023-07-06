import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { functions } from "utils/firebase";

interface ICryptoContext {
  data: Record<string, string>;
  encrypt: (data?: string) => Promise<string | undefined>;
  decrypt: (data?: string) => Promise<string | undefined>;
}

const CryptoContext = createContext<ICryptoContext>({
  data: {},
  encrypt: () => Promise.resolve(undefined),
  decrypt: () => Promise.resolve(undefined),
});

CryptoContext.displayName = "Crypto";

export const useCrypto = () => useContext(CryptoContext);

interface CryptoProviderProps {
  children: ReactNode;
}

const reducer = (
  state: Record<string, string>,
  action: { encrypted: string; decrypted: string }
): Record<string, string> => {
  return { ...state, [action.encrypted]: action.decrypted };
};

const initialState = {};

const CryptoProvider: FC<CryptoProviderProps> = ({ children }) => {
  const [data, dispatch] = useReducer(reducer, initialState);

  const [encrypt] = useHttpsCallable<
    string,
    string
  >(functions, "encrypt");
  const [decrypt] = useHttpsCallable<
    string,
    string
  >(functions, "decrypt");

  const context = useMemo(() => {
    return {
      data,
      encrypt: async (string?: string) => {
        if (string) {
          const result = await encrypt(string);

          if (result?.data) {
            dispatch({ encrypted: result.data, decrypted: string });
          }

          return result?.data;
        }
      },
      decrypt: async (string?: string) => {
        if (string) {
          if (data[string]) {
            return data[string];
          } else {
            const result = await decrypt(string);

            if (result?.data) {
              dispatch({ encrypted: string, decrypted: result.data });
            }

            return result?.data;
          }
        }
      },
    };
  }, [
    data,
    decrypt,
    encrypt,
  ]);

  return (
    <CryptoContext.Provider value={context}>{children}</CryptoContext.Provider>
  );
};

export default CryptoProvider;
