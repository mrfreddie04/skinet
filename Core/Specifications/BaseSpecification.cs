using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
  public class BaseSpecification<TEntity> : ISpecification<TEntity>
  {

    public BaseSpecification()
    {
        Criteria = null;
    }  

    public BaseSpecification(Expression<Func<TEntity, bool>> criteria)
    {
        //read-only props assigned in ctor
        Criteria = criteria;
    }

    public Expression<Func<TEntity, bool>> Criteria {get; }

    //initialize as empty list
    public List<Expression<Func<TEntity, object>>> Includes {get; } = 
        new List<Expression<Func<TEntity, object>>>();

    protected void AddInclude(Expression<Func<TEntity, object>> includeExpression) 
    {
        Includes.Add(includeExpression);
    }   
  }
}