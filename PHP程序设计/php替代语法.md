```php
<?=$variable?>

<ul>
<?php foreach ($todo as $item): ?>
    <li><?=$item?></li>
<?php endforeach; ?>
</ul>

<?php if ($username === 'sally'): ?>
    <h3>Hi Sally</h3>
<?php elseif ($username === 'joe'): ?>
    <h3>Hi Joe</h3>
<?php else: ?>
    <h3>Hi unknown user</h3>
<?php endif; ?>
```
