import { Api, CreatePointRequest, EditPointRequest,} from '../../real_api/MapServiceApi';


const mapApi = new Api();

export const MapService = {
  getPoints: async (params?: any) => 
    await mapApi.point.findList(params),

  getPointDetails: async (pointId: string) => 
    await mapApi.point.pointDetail(pointId),

  createPoint: async (data: CreatePointRequest) => 
    await mapApi.point.createCreate(data),

  updatePoint: async (pointId: string, data: EditPointRequest) => 
    await mapApi.point.editUpdate(pointId, data),

  deletePoint: async (pointId: string) => 
    await mapApi.point.pointDelete(pointId),

  togglePointActive: async (pointId: string, isActive: boolean) => 
    await mapApi.point.editUpdate(pointId, { isActive }),
};