import fs from 'fs'
import path from 'path'
import regionJson from './region.json'

interface Region {
  provinsi: string
  kota: string[]
}

interface SearchResult {
  kota: string
  provinsi: string
  score: number
}

class RegionService {
  private regions: Region[] = []
  private allKota: { kota: string; provinsi: string }[] = []

  constructor() {
    this.loadRegions()
  }

  private loadRegions() {
    try { 
      this.regions = regionJson
      
      this.allKota = []
      for (const region of this.regions) {
        for (const kota of region.kota) {
          this.allKota.push({
            kota: kota.trim(),
            provinsi: region.provinsi
          })
        }
      }
    } catch (error) {
      console.error('Error loading region data:', error)
    }
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length
    const n = str2.length
    
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
    
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j
    }
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j],
            dp[i][j - 1],
            dp[i - 1][j - 1]
          )
        }
      }
    }
    
    return dp[m][n]
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()
    
    const distance = this.levenshteinDistance(s1, s2)
    const maxLen = Math.max(s1.length, s2.length)
    
    if (maxLen === 0) return 1
    
    const similarity = 1 - (distance / maxLen)
    return similarity
  }

  private containsSubstring(str1: string, str2: string): boolean {
    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()
    return s1.includes(s2) || s2.includes(s1)
  }

  public searchKota(query: string, limit: number = 10, threshold: number = 0.5): SearchResult[] {
    if (!query || query.trim().length < 2) {
      return []
    }

    const results: SearchResult[] = []
    const normalizedQuery = query.trim().toLowerCase()

    for (const item of this.allKota) {
      const kota = item.kota
      const provinsi = item.provinsi
      
      const kotaSimilarity = this.calculateSimilarity(query, kota)
      const provinsiSimilarity = this.calculateSimilarity(query, provinsi)
      const combinedSimilarity = Math.max(kotaSimilarity, provinsiSimilarity)
      
      const kotaContains = this.containsSubstring(query, kota)
      const provinsiContains = this.containsSubstring(query, provinsi)
      
      let score = 0
      
      if (kotaContains) {
        score = 1.0
      } else if (provinsiContains) {
        score = 0.8
      } else if (combinedSimilarity >= threshold) {
        score = combinedSimilarity
      }
      
      if (score > 0) {
        results.push({
          kota,
          provinsi,
          score
        })
      }
    }

    results.sort((a, b) => b.score - a.score)

    return results.slice(0, limit)
  }

  public getAllProvinces(): string[] {
    return this.regions.map(r => r.provinsi)
  }

  public getKotaByProvince(province: string): string[] {
    const region = this.regions.find(r => 
      r.provinsi.toLowerCase() === province.toLowerCase()
    )
    return region ? region.kota : []
  }

  public getAllKota(): { kota: string; provinsi: string }[] {
    return this.allKota
  }
}

export default new RegionService()