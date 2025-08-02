using Microsoft.Extensions.Logging;
using shs.Application.Abstractions.Messaging;

namespace shs.Application.Abstractions.Behaviors;

internal static class LoggingDecorator
{
    internal sealed class QueryHandler<TQuery, TResponse>(
        IQueryHandler<TQuery, TResponse> innerHandler,
        ILogger<QueryHandler<TQuery, TResponse>> logger)
        : IQueryHandler<TQuery, TResponse>
        where TQuery : IQuery<TResponse>
    {
        public async Task<TResponse> Handle(TQuery query, CancellationToken cancellationToken)
        {
            logger.LogInformation("Handling query {QueryType}", typeof(TQuery).Name);
            
            try
            {
                var result = await innerHandler.Handle(query, cancellationToken);
                logger.LogInformation("Query {QueryType} handled successfully", typeof(TQuery).Name);
                return result;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error handling query {QueryType}", typeof(TQuery).Name);
                throw;
            }
        }
    }

    internal sealed class CommandHandler<TCommand>(
        ICommandHandler<TCommand> innerHandler,
        ILogger<CommandHandler<TCommand>> logger)
        : ICommandHandler<TCommand>
        where TCommand : ICommand
    {
        public async Task Handle(TCommand command, CancellationToken cancellationToken)
        {
            logger.LogInformation("Handling command {CommandType}", typeof(TCommand).Name);
            
            try
            {
                await innerHandler.Handle(command, cancellationToken);
                logger.LogInformation("Command {CommandType} handled successfully", typeof(TCommand).Name);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error handling command {CommandType}", typeof(TCommand).Name);
                throw;
            }
        }
    }

    internal sealed class CommandHandler<TCommand, TResponse>(
        ICommandHandler<TCommand, TResponse> innerHandler,
        ILogger<CommandHandler<TCommand, TResponse>> logger)
        : ICommandHandler<TCommand, TResponse>
        where TCommand : ICommand<TResponse>
    {
        public async Task<TResponse> Handle(TCommand command, CancellationToken cancellationToken)
        {
            logger.LogInformation("Handling command {CommandType}", typeof(TCommand).Name);
            
            try
            {
                var result = await innerHandler.Handle(command, cancellationToken);
                logger.LogInformation("Command {CommandType} handled successfully", typeof(TCommand).Name);
                return result;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error handling command {CommandType}", typeof(TCommand).Name);
                throw;
            }
        }
    }
}