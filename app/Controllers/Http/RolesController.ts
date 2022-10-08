import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission';
import Role from 'App/Models/Role';
import { schema } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database'


export default class RolesController {
  public async index({view}: HttpContextContract) {
    const roles = await Role.query().preload('permissions');

    return view.render('roles/index', {
      roles
    });
  }

  public async create({view}: HttpContextContract) {
    const role = {
      name: '',
    }
    const permissions = await Permission.all()
    return view.render('roles/create', {
      role,
      permissions
    })}

  public async store({request, response, session}: HttpContextContract) {
    const roleSchema = schema.create({
      name: schema.string()
    });
    const payload = await request.validate({ schema: roleSchema })


    const role = await Role.create({
      name: payload.name
    });

    await role.related('permissions').sync(request.body().permission_ids);

    session.flash('success', 'Role created')
    return response.redirect().toRoute('roles.index');
  }

  public async show({}: HttpContextContract) {
  }

  public async edit({view, params}: HttpContextContract) {

    const role = await Role.findOrFail(params.id)
    const permissions = await Permission.all()

    let raw_role_perimssions = await Database.rawQuery('select * from role_permissions where role_id = ?', [params.id])

    let role_permissions = [];
    raw_role_perimssions[0].map(d => {
      role_permissions.push(d.permission_id);
    });

    return view.render('roles/edit', {
      role,
      permissions,
      role_permissions
    })
  }

  public async update({request, session, response, params}: HttpContextContract) {
    const roleSchema = schema.create({
      name: schema.string()
    });
    const payload = await request.validate({ schema: roleSchema })

    const role = await Role.findOrFail(params.id)
    role.name = payload.name;
    await role.save()

    console.log(request.body().permission_ids);


    await role.related('permissions').sync(request.body().permission_ids);

    session.flash('success', 'Role updated')
    return response.redirect().toRoute('roles.index');}

  public async destroy({}: HttpContextContract) {}
}
