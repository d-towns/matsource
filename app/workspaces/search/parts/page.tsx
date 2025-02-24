import SearchForm from "@/components/SearchForm"
import { SearchHistory } from "@/components/SearchHistory"
import { Separator } from "@/components/ui/separator"
import { SearchProvider } from "@/contexts/search-context"

export default function SearchPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold">Parts Search</h2>
        </div>
        <Separator />
        <SearchProvider>
          <div className="flex flex-col space-y-6">
            <SearchForm />
            <SearchHistory />
          </div>
        </SearchProvider>
      </div>
    </div>
  )
}
