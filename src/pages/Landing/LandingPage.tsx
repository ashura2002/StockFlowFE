import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import {
  BoxesIcon,
  ClipboardIcon,
  ShoppingCartIcon,
  TagIcon,
  TruckIcon,
  UserPlusIcon,
  UsersIcon,
} from '../../components/ui/icons'

const features = [
  {
    icon: BoxesIcon,
    title: 'Inventory & Products',
    description:
      'Admins manage the product catalog — track items, descriptions, and availability from one dashboard.',
  },
  {
    icon: TagIcon,
    title: 'Categories',
    description:
      'Group products into categories so customers can browse the shop quickly and easily.',
  },
  {
    icon: TruckIcon,
    title: 'Suppliers',
    description:
      'Track supplier records and stay on top of where your inventory comes from.',
  },
  {
    icon: ClipboardIcon,
    title: 'Orders',
    description:
      'Customers place orders and monitor their status from pending to completed; admins confirm and complete them.',
  },
  {
    icon: UsersIcon,
    title: 'User Management',
    description:
      'Administrators view accounts, roles, and profiles across the whole platform.',
  },
  {
    icon: ShoppingCartIcon,
    title: 'Shopping',
    description:
      'A full customer storefront — browse, add to cart, and place orders in a few clicks.',
  },
]

export function LandingPage() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
            <img
              src="/Stockflow.png"
              alt="StockFlow logo"
              className="h-6 w-6 rounded object-contain"
            />
          </div>
          <span className="text-lg font-bold text-gray-900">StockFlow</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 sm:h-20 sm:w-20">
              <img
                src="/Stockflow.png"
                alt="StockFlow logo"
                className="h-10 w-10 rounded object-contain sm:h-12 sm:w-12"
              />
            </div>
            <h1 className="mx-auto max-w-2xl text-3xl font-bold text-gray-900 sm:text-5xl">
              Inventory that flows
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 sm:text-lg">
              StockFlow is an inventory &amp; ordering platform. Admins run
              products, categories, suppliers, and orders; customers shop the
              catalog and track their purchases.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                className="w-full px-8 py-3 text-base sm:w-auto"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full px-8 py-3 text-base sm:w-auto"
                onClick={() => navigate('/register')}
              >
                Create an account
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            What is this application about?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-600 sm:text-base">
            Select a feature to learn more about what StockFlow does.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const isExpanded = expanded === index
              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : index)}
                  aria-expanded={isExpanded}
                  className={`flex flex-col items-start gap-3 rounded-2xl border bg-white p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isExpanded
                      ? 'border-indigo-300 ring-2 ring-indigo-100'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    {isExpanded && (
                      <p className="mt-1 text-sm text-gray-600">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500 sm:px-6">
          <UserPlusIcon className="h-4 w-4" />
          <span>Made for admins &amp; customers. Start with StockFlow today.</span>
        </div>
      </footer>
    </div>
  )
}