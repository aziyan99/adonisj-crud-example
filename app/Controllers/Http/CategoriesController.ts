import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'


export default class CategoriesController {
  public async index({view}: HttpContextContract) {
    const categories = await Category.all();
    return view.render('category/index', {
      categories
    })
  }

  public async create({view}: HttpContextContract) {
    const category = {
      name: ''
    }

    return view.render('category/create', {
      category
    })
  }

  public async store({request, response, session}: HttpContextContract) {
    const newCategorySchema = schema.create({
      name: schema.string(),
    })
    const payload = await request.validate({ schema: newCategorySchema })

    await Category.create({
      name: payload.name
    })

    session.flash('success', 'Category created')
    return response.redirect().toRoute('categories.index');
  }

  public async edit({view, params}: HttpContextContract) {
    const category = await Category.findOrFail(params.id)

    return view.render('category/edit', {
      category
    })
  }

  public async update({params, request, response, session}: HttpContextContract) {
    const newCategorySchema = schema.create({
      name: schema.string(),
    })
    const payload = await request.validate({ schema: newCategorySchema })

    const category = await Category.findOrFail(params.id)
    category.name = payload.name
    await category.save()

    session.flash('success', 'Category updated')
    return response.redirect().toRoute('categories.index')
  }

  public async destroy({response, params, session}: HttpContextContract) {
    const category = await Category.findOrFail(params.id)
    await category.delete()

    session.flash('success', 'Category deleted')
    return response.redirect().toRoute('categories.index')
  }
}
