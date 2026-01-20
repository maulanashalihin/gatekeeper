import RegionService from '../services/RegionService'
import Validator from '../services/Validator'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters'),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  threshold: z.coerce.number().min(0).max(1).optional().default(0.5)
})

export default {
  async search(request: any, response: any) {
    try {
      const query = request.query.q?.trim()
      const limit = parseInt(request.query.limit) || 10
      const threshold = parseFloat(request.query.threshold) || 0.5

      if (!query || query.length < 2) {
        return response.status(400).json({
          success: false,
          message: 'Query must be at least 2 characters',
          data: []
        })
      }

      const results = RegionService.searchKota(query, limit, threshold)

      return response.json({
        success: true,
        data: results
      })
    } catch (error) {
      console.error('Error searching kota:', error)
      return response.status(500).json({
        success: false,
        message: 'Internal server error',
        data: []
      })
    }
  },

  async getProvinces(request: any, response: any) {
    try {
      const provinces = RegionService.getAllProvinces()

      return response.json({
        success: true,
        data: provinces
      })
    } catch (error) {
      console.error('Error getting provinces:', error)
      return response.status(500).json({
        success: false,
        message: 'Internal server error',
        data: []
      })
    }
  },

  async getKotaByProvince(request: any, response: any) {
    try {
      const province = request.params.province

      if (!province) {
        return response.status(400).json({
          success: false,
          message: 'Province is required',
          data: []
        })
      }

      const kotaList = RegionService.getKotaByProvince(province)

      return response.json({
        success: true,
        data: kotaList
      })
    } catch (error) {
      console.error('Error getting kota by province:', error)
      return response.status(500).json({
        success: false,
        message: 'Internal server error',
        data: []
      })
    }
  },

  async getAllKota(request: any, response: any) {
    try {
      const allKota = RegionService.getAllKota()

      return response.json({
        success: true,
        data: allKota
      })
    } catch (error) {
      console.error('Error getting all kota:', error)
      return response.status(500).json({
        success: false,
        message: 'Internal server error',
        data: []
      })
    }
  }
}
