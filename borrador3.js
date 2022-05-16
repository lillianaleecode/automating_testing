_page.Console += async (sender, args) =>
{
    switch (args.Message.Type)
    {
        case ConsoleType.Error:
            try
            {
                var errorArgs = await Task.WhenAll(args.Message.Args.Select(arg => arg.ExecutionContext.EvaluateFunctionAsync("(arg) => arg instanceof Error ? arg.message : arg", arg)));
            
            }
            catch { }
            break;
        case ConsoleType.Warning:
            _logger.LogWarning(args.Message.Text);
            break;
        default:
            _logger.LogInformation(args.Message.Text);
            break;
    }
};