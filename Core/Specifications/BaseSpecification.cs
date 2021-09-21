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

    public Expression<Func<TEntity, object>> OrderBy { get; private set;}

    public Expression<Func<TEntity, object>> OrderByDescending { get; private set;}

    public int Take { get; private set;}

    public int Skip { get; private set;}

    public bool IsPagingEnabled { get; private set;}

    protected void AddInclude(Expression<Func<TEntity, object>> includeExpression) 
    {
        Includes.Add(includeExpression);
    }   

    protected void AddOrderBy(Expression<Func<TEntity, object>> orderByExpression) 
    {
        OrderBy = orderByExpression;
    }   

    protected void AddOrderByDescending(Expression<Func<TEntity, object>> orderByDescendingExpression) 
    {
        OrderByDescending = orderByDescendingExpression;
    }  

    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }
  }
}