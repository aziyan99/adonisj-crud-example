import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export default class RolesController {

  public async index({view}: HttpContextContract) {
    const roles = await Role.query().preload('permissions');

    return view.render('roles/index', {
      roles
    });
  }

}
